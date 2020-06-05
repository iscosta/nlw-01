import React, {useEffect,useState, ChangeEvent, FormEvent} from 'react';
import './styles.css';
import logo from '../../assets/logo.svg';
import { Link , useHistory} from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import {Map,TileLayer,Marker} from 'react-leaflet';
import {LeafletMouseEvent} from 'leaflet'
import api from '../../services/api';
import axios from 'axios';
import Dropzone from '../../components/Dropzone'

interface Item {
    id: number;
    name: string;
    image_url: string;
}

interface UF {
    id: number;
    sigla: string;
}

interface Cities {
    id: number;
    nome: string;
}

const CreatePoint = () => {
    const [items,setItems] = useState<Item[]>([])
    const [ufs,setUfs] = useState<UF[]>([])
    const [cities,setCities] = useState<Cities[]>([]);
    const [selectedUf,setSelectedUf] = useState('0');
    const [selectedCity,setSelectedCity] = useState('0');
    const [selectedPosition,setSelectedPosition] = useState<[number,number]>([0,0]);
    const [initialPosition,setInitialPosition] = useState<[number,number]>([0,0]);
    const [formData,setFormData] = useState({name:'',email:'',whatsapp:''})
    const [selectedItems,setSelectedItems] = useState<number[]>([]);
    const [selectedFile,setSelectedFile] = useState<File>();
    const history = useHistory()

    function handleSelecteUf(event: ChangeEvent<HTMLSelectElement>){
        setSelectedUf(event.target.value)
    }

    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>){
        setSelectedCity(event.target.value)
    }

    function handleMapClick(event: LeafletMouseEvent){
        const {lat,lng} = event.latlng
        setSelectedPosition([lat,lng]);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name,value} = event.target;
        setFormData({...formData, [name]: value})
    }

    function handleSelectItem(id:number){
        const alreadySelected = selectedItems.findIndex(item => item === id)
        if(alreadySelected >=0) {
            const filteredItems = selectedItems.filter(item => item !== id)
            setSelectedItems(filteredItems)
        }else{
            setSelectedItems([...selectedItems,id])
        }
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault();

        const {name,email,whatsapp} = formData
        const uf = selectedUf
        const city = selectedCity
        const [latitude,longitude] = selectedPosition
        const items = selectedItems

        const data = new FormData();

        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('uf', uf);
        data.append('city', city);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(','));
        selectedFile && data.append('image', selectedFile )

        await api.post('points', data)

       alert("Ponto de coleta criado com sucessso!")

       history.push('/')
    }

    useEffect(() => {
        api.get('items').then(resp => {
            setItems(resp.data);
        })
    },[])

    useEffect(() => {
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(resp => {
            setUfs(resp.data);
        })
    },[])

    useEffect(() => {
        if(selectedUf ==='0') return
        axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(resp => {
            setCities(resp.data);
        })
    },[selectedUf])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude,longitude} = position.coords
            setInitialPosition([latitude,longitude]) 
        })
    },[])

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para Home
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>
                <Dropzone onFileUploaded={setSelectedFile} />
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">WhatsApp</label>
                        <input
                            type="text"
                            name="whatsapp"
                            id="whatsapp" 
                            onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>
                    <fieldset>
                        <legend>
                            <h2>Endereço</h2>
                            <span>Selecione endereço no mapa</span>
                        </legend>
                        <Map center={initialPosition} zoom={15}  onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={selectedPosition}/>
                        </Map>
                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="uf">Estado (UF)</label>
                                <select name="uf" id="uf" value={selectedUf} onChange={handleSelecteUf}>
                                    <option value="0">Selecione uma UF</option>
                                    {ufs.map(uf => (
                                        <option key={uf.id} value={uf.sigla}>{uf.sigla}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field">
                                <label htmlFor="city">Cidade</label>
                                <select name="city" id="city" value={selectedCity} onChange={handleSelectedCity}>
                                    <option value="0">Cidade</option>
                                    {cities.map(city => (
                                        <option key={city.id} value={city.nome}>{city.nome}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>
                            <h2>Ítens de coleta</h2>
                            <span>Selecione eum ou mais itens abaixo</span>
                        </legend>
                        <ul className="items-grid">
                            {items.map((item) => (
                                <li key={item.id} onClick={() => handleSelectItem(item.id)} className={selectedItems.includes(item.id) ? 'selected' : ''}> 
                                    <img src={item.image_url} alt={item.name}/>
                                    <span>{item.name}</span>
                                </li>
                            ))}
           
                        </ul>
                    </fieldset>
                    <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    ) 
}

export default CreatePoint;