# Todo List: Integrate SQLite Data into Products Page

This document outlines the steps to replace the mock data in the `pony-canyon-figure-clone` products page with real data from the SQLite database.

## 1. Create a new API route in Next.js

- [ ] Create a new file `C:\frontend\BiliShareMall\pony-canyon-figure-clone\src\app\api\products\route.ts`.
- [ ] In this new file, import the `searchGoodsItems` function from `C:\frontend\BiliShareMall\express-api\src\services\goods.ts`.
- [ ] Create a `GET` request handler in the new route that calls `searchGoodsItems` and returns the data as a JSON response.
- [ ] The handler should accept query parameters for pagination (`page`, `pageSize`) and filtering (`name`, `priceFlow`, `priceCeil`).

## 2. Modify the Products Page

- [ ] Open the file `C:\frontend\BiliShareMall\pony-canyon-figure-clone\src\app\products\page.tsx`.
- [ ] Remove the mock `products` array.
- [ ] Use the `useState` and `useEffect` hooks to fetch data from the new API route (`/api/products`).
- [ ] Implement state management for:
    - `products`: to store the fetched product data.
    - `page`: to keep track of the current page.
    - `pageSize`: to control the number of items per page.
    - `total`: to store the total number of products.
    - `filters`: to manage the filter values.
- [ ] Update the `ProductCard` component to handle the new data structure from the database.
- [ ] Add pagination controls to the UI, including "Previous" and "Next" buttons.
- [ ] Connect the filter UI elements to the `filters` state and re-fetch data when the filters change.

## 3. Refactor and Test

- [ ] Ensure the `searchGoodsItems` function correctly handles all filter parameters.
- [ ] Test the API route to make sure it returns the correct data and handles errors gracefully.
- [ ] Test the products page to ensure that data is displayed correctly, pagination works as expected, and filters are applied correctly.
- [ ] Verify that the application is fully responsive and works well on both desktop and mobile devices.
