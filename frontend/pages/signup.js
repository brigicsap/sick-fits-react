import Signup from '../components/Signup'
import SignIn from '../components/SignIn'
import styled from 'styled-components'

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));
  grid-gap: 2rem;
`

const SignupPage = props => (
  <Columns>
    <Signup />
    <SignIn />
  </Columns>
)

export default SignupPage
