const express = require('express')
const path = require('path')
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')

const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'cricketTeam.db')
let db = null
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server running at localhost:3000')
    })
  } catch (e) {
    console.log(`DB Error {e.message}`)
  }
}

initializeDBAndServer()

//GET players API

app.get('/players/', async (request, response) => {
  const getPlayersQuery = `
  SELECT 
    *
  FROM 
  cricket_team
  ORDER BY player_id
  `
  const playersArray = await db.all(getPlayersQuery)
  response.send(playersArray)
})

//post player API

app.post('/players/', async (request, response) => {
  const getDetails = request.body
  const {playerName, jerseyNumber, role} = getDetails
  const addPlayerQuery = `
    INSERT INTO
      cricket_team (player_name, jersey_number, role)
    VALUES
      (
        '${playerName}',
         ${jerseyNumber},
        '${role}'
      );`
  const dbResponse = await db.run(addPlayerQuery)
  const playerId = dbResponse.lastID
  response.send('Player Added to Team')
})

//singe player API

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerQuery = `
  SELECT 
    *
  FROM 
  cricket_team
  WHERE player_id = ${playerId}
  `
  const playerDetails = await db.get(playerQuery)
  response.send(playerDetails)
})

//update player API

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getDetails = request.body

  const {playerName, jerseyNumber, role} = getDetails
  const updatePlayerQuery = `
    UPDATE
    cricket_team
    SET
    player_name = '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}'
    WHERE 
    player_id = ${playerId};
  `
  await db.run(updatePlayerQuery)
  response.send('Player Details Updated')
})

//Delete player API

app.delete('/players/:playerId', async (request, response) => {
  const {playerId} = request.params

  const deleteQuery = `
  DELETE FROM
  cricket_team
  WHERE 
  player_id = ${playerId};
  `
  await db.run(deleteQuery)
  response.send('Player Removed')
})

module.exports = app;