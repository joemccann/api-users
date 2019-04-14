const Firestore = require('@google-cloud/firestore')
const { isEmail } = require('sanitizer')

const PROJECTID = process.env.PROJECT || null
const COLLECTION = process.env.COLLECTION

const db = new Firestore({ projectId: PROJECTID })

exports['api-users'] = async (req, res) => {
  const {
    body,
    query
  } = req

  if (req.method === 'POST') {
    const data = body || {}
    const { email = null, update = false, username = null } = data
    const ctime = Date.now()

    if (!username) return res.status(404).send({ err: `Username required.` })

    if (!email && !update) {
      return res.status(404).send({ err: `Email address required.` })
    }

    //
    // Validate email address
    //
    if (!isEmail(email)) {
      return res.status(404)
        .send({ err: `Your email address, ${email}, is invalid.` })
    }

    //
    // First, check to see if username exists and if it does, bail
    //
    try {
      const doc = await db.collection(COLLECTION).doc(username).get()

      if (doc && doc.exists && !update) {
        return res.status(404)
          .send({ err: `Username, ${username}, already exists.` })
      }
    } catch (err) {
      return { err: err.message || err }
    }

    try {
      const doc = await db.collection(COLLECTION).doc(username)

      let writeResult = null
      if (update) {
        delete data.update // Don't save this.
        writeResult = await doc.set(data, { merge: update })
      } else {
        writeResult = await doc.set(
          { ctime, username, email })
      }

      const write = writeResult.writeTime.toDate()

      if (write) return res.status(200).send({ data: 'OK' })

      return res.status(404).send({
        err: 'Write time not present from database.'
      })
    } catch (e) {
      return res.status(404).send({ err: e.message || e })
    }
  }

  if (req.method === 'DELETE') {
    let username = query.username || null

    if (!(username && username.length)) {
      return res.status(404).send({ err: 'Username is empty.' })
    }

    username = username.trim()

    try {
      await db.collection(COLLECTION).doc(username).delete()
      return res.status(200).send({ data: `OK` })
    } catch (e) {
      return res.status(404).send({ err: e.message || e })
    }
  }

  if (!(query && query.id)) {
    return res.status(404).send({ err: 'No ID is present to query.' })
  }

  //
  // Sanitize the ID
  //
  const id = query.id.trim()

  if (!(id && id.length)) {
    return res.status(404).send({ err: 'ID is empty.' })
  }

  try {
    const doc = await db.collection(COLLECTION).doc(id).get()

    if (!(doc && doc.exists)) {
      return res.status(404)
        .send({ err: `Unable to find the document for ${id}.` })
    }

    const data = doc.data()

    return res.status(200).send({ data })
  } catch (e) {
    return res.status(404).send({ err: e.message || e })
  }
}
