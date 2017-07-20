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
  fs.readFileSync('./data/house.json', 'utf8')
)

const senate = JSON.parse(
  fs.readFileSync('./data/senate.json', 'utf8')
)

// Loop through the government data and start to sort them by
// state and district.
let congressByStateAndDistrict = {}

forEach(house, (member) => {

  // If this isn't a congressman with a district, it is likely a Senator.
  // We don't want to deal with Senator data just yet.
  if (!member.district) {
    console.error(`${member.person.name} is not a Congressman.`)
    return
  }

  const district = parseInt(member.district, 10)
  if (isNaN(district)) {
    console.error(`District ${district} is not numeric`)
    return
  }

  const state = person.state

  // Add this person object to the associated location in the
  // congressByStateAndDistrict object.
  if (!congressByStateAndDistrict[state]) {
    congressByStateAndDistrict[state] = []
  }

  congressByStateAndDistrict[state][district] = person

})

console.log('Finished breaking down congressmen by district and state.')
console.log('Now attempting to generate static HTML that represents these congressmen')

// First create the specific district classes.
forOwn(congressByStateAndDistrict, (districts, state) => {
  for (let i = 0; i < districts.length; i++) {
    if (!districts[i]) {
      continue
    }

    const person = districts[i]

    const fieldsToReplaceMap = {
      '<District />': person.description,
      '<Congressman />': `${person.person.firstname} ${person.person.lastname}`,
      '<Party />': person.party,
      '<Phone />': person.phone
    }

    let districtHtml = template({
      name: `${person.person.firstname} ${person.person.lastname}`,
      title: person.description,
      party: person.party,
      phoneNumber: person.phone,
      imageUrl: person.photos.small,
    });

    console.log(districtHtml);

    const fileName = `${state}-${i}.html`
    fs.writeFileSync(`./dist/${fileName}`, districtHtml)
  }
})

