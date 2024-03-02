# qp-assessment

_Product Brief: This Product(Backend Application) is built for the Business Model - E-Commerce as Grocery Booking Application_ 

Stack: Typescript/Javascript, Expreess.js, SQL DB - PostgreSQL, Prisma(ORM), JsonWebToken, Docker for Containerize

_Run Commands are below_

_Roles_
1. Admin:
   - The Admin can Manage the Inventory like add/update/delete/view current grocery Stock.
   - And can get insights about Transactions & User purchased order or pending Orders.
2. Public User:
   - View the available groceries
   - Purchase Grocery either single item or can purchase bulk groceries in Single Order
     
_Constrains_
1. Both Admin & Public User should login, JWT token created based on User Roles.
2. Admin have to enter additional key while login, to identify as Admin.
3. Public User can't access Admin Routes, but Admin can access al the Routes.

# **Functionalities**

- [ ] Public User Actions:

**1. View Groceris List**
> api - /grocery/list
  - Either Admin/Public User can check the grocery list through this api.
  - Returns List of groceries and it's details
    
**2. Purchase Order**
> api - /grocery/purchase-grocery
  - The Public User can create Purchase Order for either single item or can purchase bulk groceries in Single Order.
  - This will store the order as a pending order and return a unique transactionId for either single or bulk purchase.
  - After the order is created, based on the Item selected and quantity picked, the Inventory stock limit will also be reduced.
  - Returns transactionId with total Amount.
    
**3. Confirm Pending Order**
> api - /grocery/confirm-purchaseGrocery
  - The User wants to confirm their order by paying the total amount as per their order.
  - After Payment, the Order will be marked as Purchased.
  - Returns Confirmed Orders list & Transaction Details contains Status.
> Currently, from Postman, the API will be hit with transactionId and total Amount, if the Frontend & Payment Gateway are Integrated, we can automate this. Since the motive of this route is to generate a Payment Page URL only. And from the Payment Gateway, they want to redirect the User to /updatePayment server route and here we can update the Grocery Purchased according to the Payment Status.

- [ ] Admin Actions

**1. Create Grocery**
> api - /grocery/create-grocery
  - The Admin can add New grocery to Inventory
  - Returns with groceryId and feedeed details

**2. Update Grocery**
> api - /grocery?groceryId={groceryId}
  - This Patch Method, the Admin can update Grocery Stock Count, Name, Type, Price
  - Returns updated Grocery information.

**3. Delete Grocery**
> api - /grocery?groceryId={groceryId}
  - This is Delete Method, delete the Grocery by id.
  - Returns Success Message

**4. Get Grocery**
> api - /grocery?groceryId={groceryId}
  - Get Method, gets Grocery Details by the id.

**5. Get All Groceries**
> api - /grocery/getAll-groceries
  - Returns the Groceries list with Current Stock count

**6. Get All Orders**
> api - /grocery/getAll-orders
  - Get the Pending Orders & Confirmed Order.
  - This will Return which User Ordered, TranactionId, etc.

**7. Get All Transactions**
> api - /grocery/getAll-transactions
  - Returns the insights about the Payment Transaction details like Status, Total Amount of Purchase, Purchaser Id.

### JWT Security Implementation

**Features**

1. _Token Expiry Time is 1hr from created time._
2. _Roles_ - Admin, User

> Admin

- Admin Can access all the Routes
- There will be a check, in Middleware, to verify if the JWT token has an isAdmin flag as true and has an admin key, and Invalid access will be thrown if these criteria are not matched.
- And the Non-Admin Users won't able to access the Admin Protected Routes
- The Admin also 1st went through the General Auth Middleware route, follow below about General Auth Middleware.

> User

- The User will be authenticated before the User accesses the General API which is exposed to Non Admin Users.
- Here the isAdmin flag will be false and no admin key will be available in the JWT Token.

### Login & Register User

- While Login & Register New Users they have to pass the admin key as like password along with the password. The JWT Token will have this admin key and isAdmin flag as true and the same key will be used for through session.
- For Non-Admin Users, an admin key is not required and the JWT signed token will not have an admin key and isAdmin flag as false.

> Run by Docker Image Locally
  - `docker pull ramvignesh974/qp-assessment:latest`
  - `docker run -e "DATABASE_URL=postgres://avnadmin:AVNS_7KqcEglPxsR1U8ug640@pg-b203e56-ramvignesh974-ea80.a.aivencloud.com:14095/qp-grocery?sslmode=require?sslcert=ca.pem" -e "AUTH_ACCESS_TOKEN_SECRET_KEY=jwt-test-secret-key" -e "AUTH_ACCESS_TOKEN_EXPIRY=1hr" -e "PORT=5000" -p 5000:5000 ramvignesh974/qp-assessment:latest
`
Note: Since it is test details, there is no Risk to Expose the DB ConnectionURL, JWT Auth keys.
