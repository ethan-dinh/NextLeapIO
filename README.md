# NextLeap

NextLeap is an innovative app designed to help recent college graduates connect with peers who are moving to the same cities. It tracks users' future plans and suggests potential connections based on mutual friends and shared destinations.

## Table of Contents

- [Project Summary](#project-summary)
- [Features](#features)
  - [Posting Features](#posting-features)
  - [Networking Features](#networking-features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Summary

Every year, millions of students graduate from college and embark on new journeys, moving to various cities to begin their careers. This transition, while exciting, often presents challenges such as making new friends or finding suitable roommates in unfamiliar environments. NextLeap aims to address these issues by enabling users to update their potential plans and build a network through which friends of friends moving to the same location will be suggested. This fosters connections and provides a supportive community, making the transition to a new city less daunting and more socially enriching.

## Features

### Posting Features

- **Detailed Posts**: Users can share detailed information about their post-graduation plans, including their intended destinations and a brief description of their goals and interests related to the move.
- **Search Functionality**: Users can search for specific locations to see who else is planning to move there and create posts about their plans.

### Networking Features

- **Friend Suggestions**: NextLeap suggests friends of friends who are planning to move to the same destination, leveraging the power of mutual connections to help users expand their social circles.
- **User Profiles**: Users can view profiles, send friend requests, and initiate conversations, making it easier to find roommates, professional contacts, or friends in their new city.

## Getting Started

### Prerequisites

Ensure you have the following installed on your development machine:

- Node.js
- npm
- React

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/NextLeap.git
   cd NextLeap
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add your configuration details. An example `.env` file might look like this:

   ```
   REACT_APP_AWS_ACCESS_KEY_ID=your_aws_access_key
   REACT_APP_AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   REACT_APP_AWS_REGION=your_aws_region
   REACT_APP_BUCKET_NAME=your_s3_bucket_name
   REACT_APP_API_BASE_URL=https://your.api.base.url/
   ```

4. **Build and start the application:**

   ```bash
   npm run build
   npm start
   ```

## Usage

1. **Access the application:**

   Open your browser and go to [NextLeap](https://ix.cs.uoregon.edu/~edinh/NextLeap/).

2. **Creating a Post:**

   - Navigate to the profile page.
   - Use the location search to find your intended destination.
   - Create a post with a description of your plans.

3. **Connecting with Peers:**

   - View suggested friends who are planning to move to the same destination.
   - Send friend requests and start building your network.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

1. Fork the repository.
2. Create a new branch: `git checkout -b my-feature-branch`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin my-feature-branch`.
5. Submit a pull request.

## License

This project is licensed under the MIT License.

---

This README file provides a comprehensive overview of the NextLeap project, including its features, installation steps, and usage instructions. Feel free to customize it further based on your project's specifics.
