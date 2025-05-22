# CodeMirror Fountain Demo

A web-based editor for Fountain screenplay format using CodeMirror 6. This project provides a modern, feature-rich environment for writing screenplays in the Fountain markup language.

## Features

- Real-time Fountain syntax highlighting
- Modern web-based editor interface
- Built with CodeMirror 6 for optimal performance
- Vite-powered development environment

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14.x or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:

```bash
git clone [your-repository-url]
cd [repository-name]
```

2. Install dependencies:

```bash
npm install
```

## Development

To start the development server:

```bash
npm run dev
```

This will start the Vite development server, typically at `http://localhost:5173`

## Project Structure

- `index.html` - Main HTML file
- `fountain.ts` - Fountain language support implementation
- `package.json` - Project dependencies and scripts
- `postcss.config.js` - PostCSS configuration

## Dependencies

### Main Dependencies

- @codemirror/commands
- @codemirror/language
- @codemirror/state
- @codemirror/view
- @lezer/common
- @lezer/highlight

### Development Dependencies

- vite
- postcss
- postcss-import
- autoprefixer

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[Add your license information here]

## Support

For support, please [add your contact information or support channels here]
