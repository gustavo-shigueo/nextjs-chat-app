This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# NextJS videochat app

This project is a reimaging of my original [WebRTC-videochat](https://github.com/gustavo-shigueo/WebRTC-videochat) webapp implemented with NextJS

My goal is to create a great user experience by creating a much nicer UI with Tailwind and a much more robust backend with NextJS API routes, a MongoDB database to store the users and their contacts, a messaging system, group calls (the previous app is limited to 2 people per call) and authentication with JWT combined with Google OAuth (may implement more social auth methods when I actually learn how to do this)

I could use some help. As of writing this README I am still trying to figure out how I'm going to do the authentication flow. The decisions I've made thus far are:

- I want to use JWT cookies to keep the users logged in (might change that for sessions if I can't figure this out)
- I want to allow social media authentication (for now just Google OAuth, but more in the future such as GitHub, Twitter, Facebook and Apple, not sure yet)
- I want to allow email/password authentication as well

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
