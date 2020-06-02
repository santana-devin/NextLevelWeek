import express from  'express';
import knex from './database/connection';

const routes = express.Router();

routes.get('/itens', async (request,resposnse) => {
  
  const itens = await knex('itens').select('*');

  const serializedItens = itens.map( item => {
    return {
      id: item.id,
      title: item.title,
      image_url: `http://localhost:3000/uploads/${item.image}`
    };
  });
  
  return resposnse.json(serializedItens);
});

routes.post('points', async (request,response) => {
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

  const ids = await trx('points').insert({
    image:'nametest',
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    number,
    cyti,
    uf
  });

  const point_id = ids[0];

  const pointsItens = itens.map((iten_id:number) => {
      return {
        iten_id,
        point_id    
      }
  })

  trx('points_itens').insert(pointsItens);

  return response.json({'message':'ddd'});

});

export default routes;