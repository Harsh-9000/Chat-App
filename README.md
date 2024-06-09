# Connectify Chat App

## Description

Connectify is a chatting website. Some features:
1. JWT Authentication
2. Edit Profile
3. Add Friends
4. Send texts, images and videos.

## Live Website

Explore the live version of Connectify Chat App [here](https://connectify-chat-app.vercel.app).

## Screenshots

![Screenshot 1](https://github.com/Harsh-9000/Connectify-Chat-App/assets/113941191/b5925f0f-1716-462b-9ea9-c3ee5635b726)
![Screenshot 2](https://github.com/Harsh-9000/Connectify-Chat-App/assets/113941191/65af024a-a9d7-46f3-a2d1-6a1a9a9835c0)
![Screenshot 3](https://github.com/Harsh-9000/Connectify-Chat-App/assets/113941191/15c4e1e2-07eb-488e-b03f-8b9b04e38daa)
![Screenshot 4](https://github.com/Harsh-9000/Connectify-Chat-App/assets/113941191/ee8c2bc1-5f83-4a4b-b7a6-168a1fae8e2f)
![Screenshot 5](https://github.com/Harsh-9000/Connectify-Chat-App/assets/113941191/049bbaf7-3cb6-4eae-b2c1-5b037fc19a62)

## Setting Up the Connectify Chat App

This guide will walk you through the process of setting up the Connectify Chat App on your local machine.

## Prerequisites

Before you begin, ensure you have Node.js installed on your system.

## Cloning the Repository

Start by cloning the repository to your local machine:

```bash
git clone https://github.com/Harsh-9000/Connectify-Chat-App.git
cd Connectify-Chat-App
```

## Backend Configuration

1. **Environment Files**: Navigate to the `backend` folder and create a file: `.env`. Add the following content to the file:

    ```plaintext
    # MongoDB Variables
    MONGODB_CONNECTION_STRING=

    # JWT Variables
    JWT_SECRET_KEY=

    # Frontend Variables
    FRONTEND_URL=

    # Cloudinary Variables
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    ```

2. **MongoDB Setup**: 
    - Sign up for an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
    - Create a new cluster and follow the instructions to set up a new database.
    - Once set up, obtain your MongoDB connection string and add it to the `MONGODB_CONNECTION_STRING` variable in your `.env` files.
    - For the `.env.e2e` setup see "running automated tests" below

3. **Cloudinary Setup**:
    - Create an account at [Cloudinary](https://cloudinary.com/).
    - Navigate to your dashboard to find your cloud name, API key, and API secret.
    - Add these details to the respective `CLOUDINARY_*` variables in your `.env` files.
  
4. **JWT_SECRET_KEY**:
    - This just needs to be any long, random string. You can google "secret key generator".

5. **Frontend URL**:
    - The `FRONTEND_URL` should point to the URL where your frontend application is running (typically `http://localhost:3000` if you're running it locally).
  

## Frontend Configuration

1. **Environment Files**: Navigate to the `frontend` folder and create a file: `.env`:

    ```plaintext
    VITE_APP_BACKEND_URL=
    ```

5. **VITE_APP_BACKEND_URL**:
    - The `VITE_APP_BACKEND_URL` should point to the URL where your backend application is running (typically `http://localhost:7000` if you're running it locally).

## Running the Application

1. **Backend**:
    - Navigate to the `backend` directory.
    - Install dependencies: `npm install`.
    - Start the server: `node index.js`.

2. **Frontend**:
    - Open a new terminal and navigate to the `frontend` directory.
    - Install dependencies: `npm install`.
    - Start the frontend application: `npm run dev`.
    - The application should now be running on `http://localhost:5173` but verify this in your command line terminal
