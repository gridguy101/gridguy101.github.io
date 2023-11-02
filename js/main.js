// Load your JSON file
fetch('products.json')
    .then(response => response.json())
    .then(data => {
        let products = data; // Store the fetched products

        // Function to display products
        function displayProducts(productsToDisplay) {
            const newResultsDiv = document.createElement('div');
            newResultsDiv.id = 'results';
        
            productsToDisplay.forEach(product => {
                const result = document.createElement('div');
        
                // Create the anchor tag
                const link = document.createElement('a');
                link.href = product.link;
                link.target = '_blank';
        
                // Image
                const image = document.createElement('img');
                image.src = product.image;
                link.appendChild(image);
        
                // Title
                const titleText = document.createTextNode(product.title);
                link.appendChild(titleText);
        
                // Price
                const price = document.createElement('p');
                price.textContent = `$${parseFloat(product.price).toFixed(2)}`;
                link.appendChild(price);
        
                // Description (if you want to display it too)
                const description = document.createElement('d');
                description.innerHTML = processDescription(product.description); 
                link.appendChild(description);
        
                // Append the anchor to the result div
                result.appendChild(link);
                
                newResultsDiv.appendChild(result);
            });
        
            if (!productsToDisplay.length) {
                newResultsDiv.textContent = 'No results found';
            }
        
            const existingResultsDiv = document.getElementById('results');
            existingResultsDiv.replaceWith(newResultsDiv); // Replace the old results div with the new one
            function processDescription(description) {
                return description.replace(/\*(.*?)\*/g, '<b>$1</b>');
            }
        }
        

        function filterAndSort() {
            let filteredProducts = products;

            // Filter by search term
            const searchTerm = document.getElementById('search').value.toLowerCase();
            if (searchTerm) {
                const tokens = searchTerm.replace(/[^\w\s]/g, '').split(' ');
                filteredProducts = filteredProducts.filter(product => {
                    const productTitle = product.title.toLowerCase().replace(/[^\w\s]/g, '');
                    return tokens.every(token => productTitle.includes(token));
                });
            }

            // Filter by tags
            const typeTag = document.getElementById('typeFilter').value || 'default';
            const brandTag = document.getElementById('brandFilter').value || 'default';

            if (typeTag !== 'default') {
                filteredProducts = filteredProducts.filter(product => product.tags.type.includes(typeTag));
            }
            if (brandTag !== 'default') {
                filteredProducts = filteredProducts.filter(product => product.tags.brand.includes(brandTag));
            }


            // Filter by price
            const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
            const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
            filteredProducts = filteredProducts.filter(product => product.price >= minPrice && product.price <= maxPrice);

            // Sorting
            const sortOption = document.getElementById('sortType').value;
            switch (sortOption) {
                case 'default':
                    // Do nothing, keep the default order
                    break;
                case 'az':
                    filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case 'za':
                    filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
                    break;
                case 'low-high':
                    filteredProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'high-low':
                    filteredProducts.sort((a, b) => b.price - a.price);
                    break;
            }

            displayProducts(filteredProducts);
        }

        // Extract unique product types and brands
        let productTypes = [...new Set(products.flatMap(product => product.tags.type))];
        let productBrands = [...new Set(products.flatMap(product => product.tags.brand))];
        
        productTypes.sort();
        productBrands.sort();

        // Populate the typeFilter dropdown
        const typeFilterDropdown = document.getElementById('typeFilter');
        productTypes.forEach(type => {
            let option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            typeFilterDropdown.appendChild(option);
        });
        
        // Populate the brandFilter dropdown
        const brandFilterDropdown = document.getElementById('brandFilter');
        productBrands.forEach(brand => {
            let option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            brandFilterDropdown.appendChild(option);
        });

        // Initial display
        displayProducts(products);

        // Add event listeners for search, filter, and sort
        document.getElementById('search').addEventListener('input', filterAndSort);
        document.getElementById('typeFilter').addEventListener('change', filterAndSort);
        document.getElementById('brandFilter').addEventListener('change', filterAndSort);
        document.getElementById('minPrice').addEventListener('input', filterAndSort);
        document.getElementById('maxPrice').addEventListener('input', filterAndSort);
        document.getElementById('sortType').addEventListener('change', filterAndSort);
    })
    .catch(error => console.error('Error:', error));
