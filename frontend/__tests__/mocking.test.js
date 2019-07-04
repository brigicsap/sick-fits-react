function Person(name, foods) {
  this.name = name
  this.foods = foods
}
Person.prototype.fetchFavFoods = function () {
  return new Promise((resolve, reject) => {
    //simulate api
    setTimeout(() => resolve(this.foods), 2000)
  })
}

describe('mocking learning', () => {
  xit('mocks a reg function', () => {
    const fetchDogs = jest.fn();
    fetchDogs('snickers')
    expect(fetchDogs).toHaveBeenCalled()
    expect(fetchDogs).toHaveBeenCalledWith('snickers')
    fetchDogs('hugo')
    expect(fetchDogs).toHaveBeenCalledTimes(2)
  })

  xit('can create a person', () => {
    const me = new Person('Wes', ['pizza', 'burgs'])
    expect(me.name).toBe('Wes')
  })

  xit('can fetch foods', async () => {
    const me = new Person('Wes', ['pizza', 'burgs'])
    //mock favFoods function
    me.fetchFavFoods = jest.fn().mockResolvedValue(['sushi', 'ramen'])
    const favFoods = await me.fetchFavFoods()
    expect(favFoods).toContain('sushi')
  })
});
