
const axios = require('axios');
const fs = require('fs');

const config = { 
	headers: {'X-API-Key': 'mUb27VfDvm4bsBphp4YO38jJABcoPeiZ4jCRSu4v'}
}

axios.get('https://api.propublica.org/congress/v1/115/senate/members.json', config)
  .then(data => {
  	// console.log(data);
    fs.writeFile('./data/senate.json', JSON.stringify(data.data.results, null, '\t'), err => {
      if (err) {
        console.log(err)
      } else {
      	// console.log(result)
        console.log(`✅ Saved people (${data.data.results})`)
      }
    })
  })

axios.get('https://api.propublica.org/congress/v1/115/house/members.json', config)
  .then(data => {
  	// console.log(data);
    fs.writeFile('./data/house.json', JSON.stringify(data.data.results, null, '\t'), err => {
      if (err) {
        console.log(err)
      } else {
      	// console.log(result)
        console.log(`✅ Saved people (${data.data.results})`)
      }
    })
  })
