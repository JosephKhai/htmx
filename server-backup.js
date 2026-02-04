


app.get('/users', async (req, res) => {
    // Simulate fetching user data from a database
    try {
        setTimeout(async () => {
            const limit = +req.query.limit || 10;

            const response = await fetch(`https://jsonplaceholder.typicode.com/users?_limit=${limit}`);
            const users = await response.json();

            res.send(`
            <h1 class="text-2xl font-bold mb-4">User List</h1>
            <ul>
                ${users.map(user => `
                    <li>${user.name} - ${user.email}</li>
                    `).join('')}
            </ul>
            
            `);
            // res.json(users);

        }, 2000);


    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});


app.post('/Convert', (req, res) => {

    try {
        setTimeout(async () => {
            const fahrenheit = parseFloat(req.body.fahrenheit);
            const celsius = ((fahrenheit - 32) * 5) / 9;

            res.json({ celsius: celsius.toFixed(2) });
        }, 2000);

    } catch (error) {
        res.status(500).json({ error: 'Conversion failed' });
    }

});

let counter = 0;
app.get('/poll', (req, res) => {

    counter++;

    const data = { value: counter };

    res.json(data);

});

let currentTemperature = 20.0;
app.get('/get-temperature', (req, res) => {
    currentTemperature = (Math.random() * 30 + 10).toFixed(1); // Random temperature between 10 and 40
    res.send({ temperature: currentTemperature + ' °C' });
});


app.get('/get-AAPL', async (req, res) => {
    const stockPrice = await fetch('https://api.marketstack.com/v2/eod?access_key=988daf5dd4044e4c221d84e4d3780599&symbols=AAPL')
        .then(response => response.json())
        .then(data => data.c.toFixed(2))
        .catch(error => 'N/A');
    res.send({ price: stockPrice + ' USD' });
});


app.post('/search-contact', async (req, res) => {
    const rawSearch = req.body.search ?? '';
    const searchText = String(rawSearch).trim().toLowerCase();

    if (!searchText) {
        // Return a table row if this is going into <tbody>
        return res.send(`
      <tr>
        <td colspan="2" class="border px-4 py-2 text-red-600">
          Please enter something.
        </td>
      </tr>
    `);
    }

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const users = await response.json();

        const searchResults = users.filter((user) =>
            user.name.toLowerCase().includes(searchText) ||
            user.email.toLowerCase().includes(searchText)
        );

        // Simulate delay (optional)
        setTimeout(() => {
            const resultHtml =
                searchResults.length > 0
                    ? searchResults
                        .map(
                            (user) => `
              <tr>
                <td class="border px-4 py-2">${user.name}</td>
                <td class="border px-4 py-2">${user.email}</td>
              </tr>
            `
                        )
                        .join('')
                    : `
            <tr>
              <td colspan="2" class="border px-4 py-2 text-gray-500">
                No contacts found.
              </td>
            </tr>
          `;

            res.send(resultHtml);
        }, 1000);
    } catch (error) {
        console.error(error);
        res.status(500).send(`
      <tr>
        <td colspan="2" class="border px-4 py-2 text-red-600">
          Failed to search contacts.
        </td>
      </tr>
    `);
    }
});


app.post('/contact/email', (req, res) => {
    const submittedEmail = req.body.email;
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

    const isValid = {
        message: 'That email is valid',
        class: 'text-green-700',
    };

    const isInvalid = {
        message: 'Please enter a valid email address',
        class: 'text-red-700',
    }

    if (!emailRegex.test(submittedEmail)) {
        res.send(`
            <div class="mb-4" hx-target="this" hx-swap="outerHTML">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email Address</label>
                <input
                    name="email"
                    hx-post="/contact/email"
                    class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
                    type="email"
                    id="email"
                    value="${submittedEmail}"
                    required
                />
                <div class="${isInvalid.class}">${isInvalid.message}</div>
            </div>`);
    } else {
        res.send(`
            <div class="mb-4" hx-target="this" hx-swap="outerHTML">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email Address</label>   
                <input
                    name="email"
                    hx-post="/contact/email"
                    class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
                    type="email"
                    id="email"
                    value="${submittedEmail}"
                    required
                />
                <div class="${isValid.class}">${isValid.message}</div>
            </div>
            `);
    }
});