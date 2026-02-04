import express from 'express';

const app = express();

// set the static folder
app.use(express.static('public'));

// parse url-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// parse JSON bodies (as sent by API clients)
app.use(express.json());


// In-memory "database"
let fruitData = [
    { fruitName: 'Apple', quantity: 10 },
    { fruitName: 'Banana', quantity: 20 },
    { fruitName: 'Orange', quantity: 15 },
]

function findFruit(fruitName) {
    return fruitData.find(fruit => fruit.fruitName === fruitName);
}

function fruitExist(fruitName) {
    return findFruit(fruitName) !== undefined;
}


// GET /get-quantity - get all quantities
app.get('/fruits', (req, res) => {
    setTimeout(() => {
        res.json(fruitData);
    }, 1000);

});


// GET /get-quantity/:item - get quantity for a specific item
app.get('/fruits/:name', (req, res) => {
    const { name } = req.params;
    const fruit = findFruit(name);

    if (!fruit) {
        return res.status(404).json({ error: 'Fruit not found' });
    }
    return res.json(fruit);
});



// POST /post-quantity - create a new item
app.post('/fruits', (req, res) => {
    const { fruitName } = req.body;
    const quantity = Number(req.body.quantity);

    // Validate presence
    if (!fruitName || quantity === undefined) {
        return res.status(400).json({ error: 'Item and quantity are required' });
    }

    // Validate numeric
    if (Number.isNaN(quantity)) {
        return res.status(400).json({ error: 'Invalid quantity' });
    }

    // Check duplicate
    if (findFruit(fruitName)) {
        return res.status(409).json({ error: 'Item already exists' });
    }

    const newFruit = { fruitName, quantity };
    fruitData.push(newFruit);
    return res.status(201).json(newFruit);

});


// Get /fruits/:fruitName/edit - return editable row (name + quantity) 
app.get('/fruits/:name/edit', (req, res) => {
    const { name } = req.params;
    const fruit = findFruit(name);

    if(!fruit) {
        return res.status(404).json({ error: 'Fruit not found' });
    }
    res.json(fruit);
});


// PUT /put-quantity/:item - update existing item
app.put('/fruits/:name', (req, res) => {
    const originalName = req.params.name;
    const quantity = Number(req.body.quantity);

    if (req.body.quantity === undefined || Number.isNaN(quantity)) {
        return res.status(400).json({ error: 'Invalid name or quantity' });
    }

    const fruit = findFruit(originalName);
    if (!fruit) {
        return res.status(404).json({ error: 'Fruit not found' });
    }

    fruit.quantity = quantity;
    return res.json(fruit);
});


// DELETE /delete-quantity/:item - delete an item
app.delete('/fruits/:name', (req, res) => {
    const { name } = req.params;

    const fruitIndex = fruitData.findIndex(fruit => fruit.fruitName === name);
    if (fruitIndex === -1) {
        return res.status(404).json({ error: 'Fruit not found' });
    }

    fruitData.splice(fruitIndex, 1);
    return res.json({ message: `Fruit '${name}' deleted successfully` });
});






// start the server
app.listen(30000, () => {
    console.log('Server is running on http://localhost:30000');
});