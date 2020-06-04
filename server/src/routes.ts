import express from  'express';

import PointsConteoller from './controllers/pointsConontroller';
import ItensConteoller from './controllers/itensController';

const routes = express.Router();
const pointsController = new PointsConteoller();
const itensController = new ItensConteoller();

routes.get('/itens', itensController.index);

routes.post('/points', pointsController.create);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

export default routes;