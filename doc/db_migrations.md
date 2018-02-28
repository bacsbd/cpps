```
# Clean folders
db.gates.update({
    type: 'folder'
  }, {
    $unset: {
      platform: undefined,
      pid: undefined,
    }
  }, {
    multi: true,
  });
```
