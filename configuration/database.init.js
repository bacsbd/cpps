/** Database initialization using mongo shell script **/

conn = new Mongo();
db = conn.getDB("cpps");

root = {
  _id: ObjectId('000000000000000000000000'),
  type: 'folder',
  ancestor: [],
  ind: 0,
  title: 'Root'
}

db.gates.insert(root);
