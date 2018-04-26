import test from 'ava'
import set from '../lib/set'

test('set family name using a string', test => {
  test.is(set({}, 'familyName', 'My Font').familyName, 'My Font')
})

test('set name using a function', test => {
  let renamedFont = set({ name: 'Gosh' }, 'name', name => `${name} Darn`)
  test.is(renamedFont.name, 'Gosh Darn')
})

test('set with more arguments', test => {
  let setFont = set({}, 'classes', 'x', 'y')
  test.deepEqual(setFont.classes, ['x', 'y'])
})

test('set name using a function without existing value', test => {
  let renamedFont = set({}, 'name', name => `Darn`)
  test.is(renamedFont.name, 'Darn')
})
