## Install Project

- Create database:

    ```shell
    create database with name intikom_test_be
    create table call products with fields (id, name, price, created_at, updated_at)
    ```

- Copy & connect to database:

    ```shell
    cp .env.example .env
    ```

- Install & run project:

    ```shell
    npm install
    npm run dev
    ```