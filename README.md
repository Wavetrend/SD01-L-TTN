# Wavetrend TTN Payload Formatters

---

# For End Users

## Installation of Payload Formatters in TTN

1. Login to TTN Console
2. Navigate to 'Payload Formatters'
3. Cut & Paste the contents of the 'src/downlink.js' as the Downlink formatter
4. Cut & Paste the contents of the 'src/uplink.js' as the Uplink formatter

The 'Live Data' view will show both the raw and decoded elements on any messages.

---

# For Developers

## Prerequisites

If you want to develop, test or generate documentation for the project, 
you will need to install:

* [Node.js and NPM (the Node package manager)](https://nodejs.org/en/download/)
* Clone the repo (`git clone http://github.com/wavetrend/SD01-L-TTN` or via 
  your preferred Git client)

## Testing

1. Using your command line/terminal, change to the directory holding
   the repo on your local system
2. Run `npm install` to install/update all of the dependencies
3. Run `npm test` to run the tests and view the output

## Documentation

1. Using your command line/terminal, change to the directory holding 
   the repo on your local system
2. Run `npm install` to install/update all of the dependencies
3. Run `npm docs` to generate the documentation in the 'docs' directory
4. Optional - Run `npm watch:docs` to continually monitor for `src` changes 
and regenerate docs (useful for active development)
5. Open `index.html` to view the documentation (most comprehensive), or
6. Open `API.md` to view the simplified API in Markdown format.
