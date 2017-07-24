/**
 * This is a script that generates static React class files for two
 * different scenarios:
 *
 *  1. A state page that displays all the congressmen in that
 *     state.
 *  2. A district page that displays all the congressmen in that
 *     district (typically based on full address).
 */
const fs = require('fs')
const forEach = require('lodash/forEach')
const forOwn = require('lodash/forOwn')
const Handlebars = require('handlebars')
const handlebarsTemplateString = fs.readFileSync('./public/representative-card-template.html', 'utf8')
const template = Handlebars.compile(handlebarsTemplateString);

const house = JSON.parse(
  fs.readFileSync('./data/people.json', 'utf8')
)

const senate = JSON.parse(
  fs.readFileSync('./data/senate.json', 'utf8')
)

// Loop through the government data and start to sort them by
// state and district.
let congressByStateAndDistrict = {}


for (i=0; i < house.length; i++) {

  // If this isn't a congressman with a district, it is likely a Senator.
  // We don't want to deal with Senator data just yet.
  if (!house[i].district) {
    console.error(`${house[i].first_name} is not a Congressman.`)
    return
  }

  const district = parseInt(house[i].district, 10)
  if (isNaN(district)) {
    console.error(`District ${district} is not numeric`)
    return
  }

  const state = house[i].state

  // Add this person object to the associated location in the
  // congressByStateAndDistrict object.
  if (!congressByStateAndDistrict[state]) {
    congressByStateAndDistrict[state] = []
  }

  congressByStateAndDistrict[state][district] = house[i];

  // console.log(congressByStateAndDistrict);

// console.log('Finished breaking down congressmen by district and state.')
// console.log('Now attempting to generate static HTML that represents these congressmen')

  let districtHtml = template({
    name: `${house[i].first_name} ${house[i].last_name}`,
    title: "Representative",
    party: house[i].party,
    phoneNumber: house[i].phone,
    imageUrl: house[i].photos.small,
  });

  const fileName = `${house[i].state}-${house[i].district}.html`
  fs.writeFileSync(`./dist/members/${fileName}`, districtHtml)

}



// First create the specific district classes.
// forOwn(congressByStateAndDistrict, (districts, state) => {
//   for (let i = 0; i < districts.length; i++) {
//     if (!districts[i]) {
//       continue
//     }

//     const person = districts[i]

//     const fieldsToReplaceMap = {
//       '<District />': person.description,
//       '<Congressman />': `${house[i].first_name} ${house[i].last_name}`,
//       '<Party />': house[i].party,
//       '<Phone />': house[i].phone
//     }

//     let districtHtml = template({
//       name: `${house[i].first_name} ${house[i].last_name}`,
//       title: "Representative",
//       party: house[i].party,
//       phoneNumber: house[i].phone,
//       imageUrl: house[i].photos.small,
//     });

//     // console.log(districtHtml);

//     const fileName = `${house[i].state}-${house[i].district}.html`
//     fs.writeFileSync(`./dist/${fileName}`, districtHtml)
//   }
// })

