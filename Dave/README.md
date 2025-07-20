## CV-Library Frontend Technical Test

This repo showcases a webpage created from this mock-up:

https://xd.adobe.com/view/d78a18c3-c461-4db8-71bf-1a4101640bd6-a1bb/specs/

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Installation / Usage

Node v22.17.0

To install dependencies:

```bash
npm install
```

To run the development server:

```bash
npm run dev
```

Open one of the below with your browser to see the result.

[🇬🇧 http://localhost:3000/en](http://localhost:3000/en)
or
[🇫🇷 http://localhost:3000/fr](http://localhost:3000/fr)

To run tests

```bash
npm run test
```

## Summary

### Design Decisions

- I opted to use Typescript in addition to Javascript. This can assist with safer development by allowing to catch type errors at build time as well as warnings via static analysis (linting), and it is widely used within the industry.
- **Eslint/Prettier** - Formats code to improve readability for developers and reviewers. Highlights issues in syntax
- **Jest/React testing library** - Allows to run and write tests to ensure quality and help reduce code regression
- I have added additional user feedback (a loading skeleton and a 'Location not found' menu) as the user inputs their search term, as I feel it provides a predictable user experience.
- As the mock up did not include detailed criteria for how the suggestions needed to be presented, I opted for a combobox approach.
- I have made deliberate choices within directories such as app/components (for global reusable components) and app/forms (should there be more) with the intention of keeping the project repo scalable.
- I have used the next-intl library as the recommended approach from the NextJs documentation, and included EN and FR locales to illustrate this.
- in LocationSearchInput without having a caching mechanism I used a debounce function to reduce the amount ofredundant network calls made. E.g. If a user types in "Sutt" reasonably fast, we dont want to make call for "Su" and "Sut" queries which are already stale.

### Additional thoughts / Future improvements

- Testing was used to aid development of more complex logic, as well as demonstrating ability to write and test testable code. In a production setting, I would aim for high and comprehensive coverage, and consider additional types of tests such as E2E and visual regression.
- API consumption - initially I considered using Route API to proxy my network call, however requests were getting rejected by cloudflare due to the origin not being browser based. For the purpose of this task I opted for a fetch API, however for more complex applications with a requirement for state management, one alternative could be to use Redux and RTK.
- If there was a submit method, I would ensure that inputs are validated.
