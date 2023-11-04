import { faker } from '@faker-js/faker'

export const generar100Productos = (req,res) =>{

    try{
        const productos = createRandomProduct(100)
        res.status(200).json({message:productos})
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
    
}


const modelProduct = () => {
    return {
        _id: faker.database.mongodbObjectId(),
		title: faker.commerce.productName(),
		description: faker.commerce.productDescription(),
		category: faker.commerce.department(),
		price: faker.commerce.price(),
		stock: faker.number.int({ min: 10, max: 100 }),
		code: faker.string.uuid(),
		status: faker.datatype.boolean(),
		thumbnail: [] // No hay en faker
    }
}

export const createRandomProduct = (cantProducts) => {
    const products = []

    for (let i = 0; i < cantProducts; i++) {
        products.push(modelProduct())
    }

    return products
}

//console.log(createRandomProduct(100))