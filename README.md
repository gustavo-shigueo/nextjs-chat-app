# MimisChat video chatting web app

This is a messaging web app that allows for making video calls using the WebRTC protocol
It was created with TypeScript, Next.js, TailwindCSS and Prisma

This project was created in a period of two years with the purpose of being mine and
[@EUMIRIAM](https://github.com/EUMIRIAM)'s college graduation project.

It is a reimaging of my original [WebRTC-videochat](https://github.com/gustavo-shigueo/WebRTC-videochat)
webapp implemented with NextJS, created with the goal of creating a great user experience
with a much nicer UI and a much more robust backend with tRPC, a MySQL database to store
the users and their chats, a messaging system, group calls (the previous app is limited to
2 people per call) and authentication with JWT combined with Google OAuth.

## How to run the project

Clone this repository and create a `.env` file in the root directory, containing the
environment variables shown in `.env.example`.

Install the project dependencies by running `yarn` and then execute it by running `yarn dev`
