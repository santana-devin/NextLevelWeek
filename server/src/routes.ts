import express from  'express';

import PointConteoller from './controllers/pointsConontroller';
import ItensConteoller from './controllers/itensController';

const routes = express.Router();
const pointController = new PointConteoller();
const itensController = new ItensConteoller();

routes.get('/itens', itensController.index);

routes.post('points', pointController.create);
routes.get('points', pointController.index);
routes.get('points/:id', pointController.show);
export default routes;