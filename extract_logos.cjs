const fs = require('fs');
const data = JSON.parse(fs.readFileSync('teams.json', 'utf8'));
data.teams.forEach(t => {
  if(t.strBadge) {
    const name = t.strTeam.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    console.log(`curl -L "${t.strBadge}" -o client/public/logos/${name}.png`);
  }
});