const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

// index, show, storem update, destroy

module.exports = {
  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

  async store (request, response) {
    const { github_username, techs, latitude, longitude } = request.body; 

    let dev = await Dev.findOne({ github_username });

    if (dev) return response.json({
      message: 'Já existe um usuário cadastrado com esse nome',
    });

    const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
      let { name = login , avatar_url, bio} = apiResponse.data;
  
      const techsArrays = parseStringAsArray(techs);
  
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
  
      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArrays,
        location,
        });

    return response.json(dev); 
  }
}