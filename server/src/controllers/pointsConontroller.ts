import {Request, Response} from 'express';
import knex from '../database/connection';

class PointsController {
  async index (request: Request,response: Response){
    const {city, uf, itens} = request.query;

    const parsedIntens = String(itens).split(',').map(item => Number(item.trim()));

    const points = knex('points')
    .join('points_itens', 'points.id', '=', 'points_itens.points_id')
    .whereIn("points_itens.itens_id",parsedIntens)
    .where('city',String(city))
    .where('uf',String(uf))
    .distinct()
    .select('points.*');
    
    return response.json(points);

  }


  async create (request: Request, response: Response){
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      number,
      cyti,
      uf,
      itens
    } = request.body;
  
    const trx = await knex.transaction();
    const point = {
      image:'nametest',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      number,
      cyti,
      uf
    };
    const ids = await trx('points').insert(point);
  
    const point_id = ids[0];
  
    const pointsItens = itens.map((iten_id:number) => {
        return {
          iten_id,
          point_id    
        }
    })
  
    await trx('points_itens').insert(pointsItens);
    
    await trx.commit();
    
    return response.json({
      id:point_id,
      ...point
    });
  
  }

  async show (request:Request, response: Response ){
    
    const { id } = request.params;

    const point = knex('points').where('id',id).first();

    if(!point){
      return response.status(400).json({message:"Point not found"});
    }

    const itens = knex('itens')
    .join('points_itens',  'itens.id', '=' ,'points_itens.itens_id')
    .where('point_itens.point_id', id);

    return response.json({
      point,
      itens
    });

  }
}

  
export default PointsController;