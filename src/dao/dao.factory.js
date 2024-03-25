import config from "../config.js";

let FactoryCartService = {};

switch (config.PERSISTENCE) {
  // Por ahora solo  case(mongo)
  // case 'fs':
  //     const fsProductsService = await import('../dao/products.fs.dao.js');
  //     factoryCartService = fsProductsService.default;
  //     break;
  // Por ahora solo lo hago con el controlador de carritos (cart.controller.js). Proximamente agregare a todos los controladores (no se como agregar a varios a la vez)
  case "mongo":
    const { default: MongoSingleton } = await import("./mongo.singleton.js");
    await MongoSingleton.getInstance();

    const MongoCartService = await import("./carts.mongo.dao.js");
    FactoryCartService = MongoCartService.default;
    break;

  default:
    throw new Error(`Persistencia ${config.PERSISTENCE} no soportada`);
}

export default FactoryCartService;
