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

 const statesHash= JSON.parse(
  fs.readFileSync('./data/states_hash.json', 'utf8')
  )

// Loop through the government data and start to sort them by
// state and district.
let congressByStateAndDistrict = {}

function getOrdinal(n) {
  var s=["th","st","nd","rd"],
  v=n%100;
  return n+(s[(v-20)%10]||s[v]||s[0]);
}

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

  const stateVerbose = statesHash[state];

  // Add this person object to the associated location in the
  // congressByStateAndDistrict object.
  if (!congressByStateAndDistrict[state]) {
    congressByStateAndDistrict[state] = []
  }

  congressByStateAndDistrict[state][district] = house[i];


  let partyName = house[i].party;

  if (house[i].party == 'D') {
    partyName = 'Democrat';
  } else if (house[i].party == 'R') {
    partyName = 'Republican';
  } else if (house[i].party == 'R') {
    partyName = 'Independent';
  }

  let districtNumber = getOrdinal(house[i].district);

  let districtHtml = template({
    name: `${house[i].first_name} ${house[i].last_name}`,
    title: `Representative for ${stateVerbose}'s ${districtNumber} Congressional District.`,
    party: partyName,
    phoneNumber: house[i].phone,
    imageUrl: house[i].photos.small,
  });

  const fileName = `${house[i].state}-${house[i].district}.html`
  fs.writeFileSync(`./dist/templates/${fileName}`, districtHtml)

}