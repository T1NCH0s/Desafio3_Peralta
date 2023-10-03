import * as fs from 'fs';
export class ProductManager {
  constructor() {
    this.products = "products.json";
  }

  //Verifica si existe el archivo 'products.json'
  async existFile() {
    try {
      fs.accessSync(this.products);
      return true;
    } catch (error) {
      return false;
    }
  }

  async readFile(fileName) {
    try {
      const file = await fs.promises.readFile(fileName, "utf-8");
      return JSON.parse(file);
    } catch (error) {
      console.log(`error al leer el archivo, error: ${error}`);
    }
  }

  async validateId() {
    let file = await this.readFile(this.products);
    if (file.length) {
      let idMayor = file.reduce((p, c) => {
        return c.id > p ? c.id : p;
      }, 0);
      return idMayor + 1;
    }
    return 1;
  }

  async getProducts() {
    return (await this.readFile(this.products));
  }

  async addProduct(obj) {
    //Verifica que todos los campos sean obligatorios
    let { title, description, price, thumbnail, code, stock } = obj;
    if (title == undefined || description == undefined || price == undefined || thumbnail == undefined || code == undefined || stock == undefined) {
      return console.error("No puedes dejar un campo vacio, completalos a todos.");
    }

    try {
      let file = [];
      if (await this.existFile()) {
        file = await this.readFile(this.products);
        //verifica si ya hay un producto con el mismo code.
        let verifyCode = file.some((producto) => producto.code === code);
        if (verifyCode) {
          return console.error("Ya hay un producto registrado con el mismo Code");
        }
      }
      file.push({
        id: await this.validateId(),
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      });
      let objeto = JSON.stringify(file, null, 2);
      await fs.promises.writeFile(this.products, objeto);
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(productId) {
    let file = await this.readFile(this.products);
    let operacion = file.find((producto) => producto.id === productId);
    operacion ? console.log(operacion) : console.error("Not found");
  }

  async deleteProduct(productId) {
    let file = await this.readFile(this.products);
    let operacionEliminar = file.findIndex((producto) => producto.id === productId);

    if (operacionEliminar !== -1) {
      file.splice(operacionEliminar, 1);
      await fs.promises.writeFile(this.products, JSON.stringify(file, null, 2));
    } else {
      console.error("El producto a eliminar no existe.");
    }
  }

  async updateProduct(obj) {
    let { id, title, description, price, thumbnail, code, stock } = obj;
    let file = await this.readFile(this.products);
    let operacionUpdate = file.findIndex((producto) => producto.id === id);

    if (operacionUpdate !== -1) {
      file[operacionUpdate] = {
        id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };
      await fs.promises.writeFile(this.products, JSON.stringify(file, null, 2));
    } else {
      console.error("El producto a actualizar no existe, verifica el ID...");
    }
  }
}


/*Testing del entregable!*/
/*
(async ()=>{
    try {
        let tienda = new ProductManager()
        await tienda.getProducts()
        await tienda.addProduct({
            title: "producto prueba",
            description:"Este es un producto prueba",
            price:200,
            thumbnail:"Sin imagen",
            code:"abc123",
            stock:25
        });
        await tienda.getProducts()
        await tienda.getProductById(1)
        await tienda.updateProduct({
            id: 1,
            title: "producto Editado",
            description:"Este es un producto editado",
            price:200,
            thumbnail:"Sin imagen",
            code:"abc1235",
            stock:25
        });
        await tienda.getProducts()
        await tienda.deleteProduct(1)
       
    }catch(error){
        console.log(error)
    }
})()
*/