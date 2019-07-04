import { shallow, mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import CartCount from '../components/CartCount'

describe('<CartCount/>', () => {
  it('renders', () => {
    shallow(<CartCount count={18} />)
  })

  it('matches the snapshot', () => {
    const wrapper = shallow(<CartCount count={18} />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })

  it('updates via props', () => {
    const wrapper = mount(<CartCount count={50} />)
    return
    expect(toJSON(wrapper)).toMatchSnapshot()
    wrapper.setProps({ count: 10 })
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
});
