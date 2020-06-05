import {Request,Response} from 'express'
import knex from '../database/connection'
import YOUR_IP_ADDRESS from '../../constants'

class ItemsController {
    async index (req: Request,res: Response){
        const items = await knex('items').select('*');

        const serializedItems = items.map(item => {
            return {
                id:item.id,
                name:item.title,
                image_url: `${YOUR_IP_ADDRESS}/uploads/${item.image}`
            }
        })
        return res.json(serializedItems)
    }    
}

export default ItemsController