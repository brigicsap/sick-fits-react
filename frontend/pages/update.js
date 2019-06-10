import UpdateItem from '../components/UpdateItem'

// destructure props directly so we can use it instear of props.query
// we have direct access to the query
// because we exposed it in _app.js with pageProps.query = ctx.query
const Update = ({ query }) => (
  <div>
    <UpdateItem id={query.id} />
  </div>
)

export default Update
