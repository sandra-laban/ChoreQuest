# TODO App

For this challenge, we will build a todo app (which is a common way to practice a new technology), using the full stack! From the database to the server, the API client, React and React Query, this app will ask you to use everything you've learned.

## Setup

### 0. Cloning and installation

- [ ] Clone this repo, navigate to it, install packages, and start the server with `npm run dev`
  <details style="padding-left: 2em">
    <summary>Tip</summary>

  You may also want to start a new branch

  ```sh
  cd todo-full-stack-query
  npm i
  git checkout -b <branchname>
  npm run dev
  ```

  </details>

- [ ] See the designs [here](http://localhost:5173/designs/index.html)

<details>
  <summary>More about using <code>npm</code> vs <code>npx</code></summary>

- When running knex, run `npm run knex <command>`, e.g. `npm run knex migrate:latest` rather than using `npx`
</details>

---

## Requirements

Here's a list of steps in case they are useful. You can build in any order you like though ;)

## Back end (Server-side)

### 1. Building the database

- [ ] Design a database to store a list of tasks, e.g. task details, priority, completed yes/no
- [ ] Build the migrations and seed data

### 2. Building the API

- [ ] Build an API (back end route) to get the information from your database (list, add, update and delete)
- [ ] Test your API with Insomnia

## Front end (Client-side)

### 3. Setting the stage

- [ ] Build a React component with static html
- [ ] Follow the [design](./public/designs/index.html) template for classNames and html element layout

### 4. Building the API client

- [ ] Build API client in the front end

### 5. Querying Data 

- [ ] Write a query with the `useQuery` hook to fetch the task data from the API
- [ ] Mutate data with the `useMutation` hook to create, update, and delete task data via the API 

---

## Stretch

<details>
  <summary>More about stretch challenges</summary>

- Forms can be tough to build accessibly. First ensure all parts of your form can be reached and used with keyboard-only navigation. Then test your form page with the WAVE browser extension, and fix any accessibility issues it detects

</details>

---

[Provide feedback on this repo](https://docs.google.com/forms/d/e/1FAIpQLSfw4FGdWkLwMLlUaNQ8FtP2CTJdGDUv6Xoxrh19zIrJSkvT4Q/viewform?usp=pp_url&entry.1958421517=todo-full-stack-query)
