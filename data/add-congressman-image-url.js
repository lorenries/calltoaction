
const fs = require('fs')
const forEach = require('lodash/forEach')

const house = JSON.parse(
  fs.readFileSync('./data/house.json', 'utf8')
)

const senate = JSON.parse(
  fs.readFileSync('./data/senate.json', 'utf8')
)

const houseMembers = house[0].members;

console.log(houseMembers);

const imgRoot = 'https://theunitedstates.io/images/congress'
const smallImgDimensions = '225x275'
const largeImgDimensions = '450x550'

let people = []

for (var i = 0; i < houseMembers.length; i++) {
  
  let bioguideid = houseMembers[i].id;

  // let name = houseMembers[i].first_name + " " + houseMembers[i].last_name;
  // let district = houseMembers[i].district;
  // let party = houseMembers[i].party;
  // let state = houseMembers[i].state;

  houseMembers[i].photos = {
    small: `${imgRoot}/${smallImgDimensions}/${bioguideid}.jpg`,
    large: `${imgRoot}/${largeImgDimensions}/${bioguideid}.jpg`
  }

  // let member = {
  //   "id": bioguideid,
  //   "name": name,
  //   "state": state,
  //   "district": district,
  //   "party": party,
  //   "photos": photos
  // }

  if (houseMembers[i].in_office === true) {
    people.push(houseMembers[i]);
  } else {
    console.log('Not a current member!');
  }

}

fs.writeFile('./data/people.json', JSON.stringify(people, null, '\t'), err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`✅ Saved people (${people.length})`)
  }
});

// forEach(houseMembers, (houseMembers) => {

//   // Not needed since Propublica's API returns all current members.
//   // if (!person.current) {
//   //   console.error(`${person.person.name} is not a current worker in government.`)
//   //   return
//   // }

//   // If this isn't a congressman with a district, it is likely a Senator.
//   // We don't want to deal with Senator data just yet.
//   if (!houseMembers.district) {
//     console.error(`${houseMembers.first_name} is not a Congressman.`)
//     return
//   }

//   const { bioguideid } = houseMembers.id;

//   houseMembers.photos = {
//     small: `${imgRoot}/${smallImgDimensions}/${bioguideid}.jpg`,
//     large: `${imgRoot}/${largeImgDimensions}/${bioguideid}.jpg`
//   }

//   houseMembers.push(members)
// })

// fs.writeFile('./data/people.json', JSON.stringify(people), err => {
//   if (err) {
//     console.error(err)
//   } else {
//     console.log(`✅ Saved people (${people.length})`)
//   }
// })
