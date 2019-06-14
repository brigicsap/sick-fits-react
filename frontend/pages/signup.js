import Signup from '../components/Signup'
import styled from 'styled-components'

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));
  grid-gap: 2rem;
`

const SignupPage = props => (
  <Columns>
    <Signup />
    <Signup />
    <Signup />
  </Columns>
)

export default SignupPage
