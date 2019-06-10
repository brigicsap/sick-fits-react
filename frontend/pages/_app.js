import App, { Container } from 'next/app'
import Page from '../components/Page'
import { ApolloProvider } from 'react-apollo'
import withData from '../lib/withData'

class MyApp extends App {
  // next.js lifecycle method that runs before the first render happens
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}
    //this will check any query on the page and these will be resolved before the page gets rendered
    //fetches and returns any necessary data before the page is rendered
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    // exposes the query to the user
    pageProps.query = ctx.query
    // by returning anything here, they will be exposed as props
    return { pageProps }
  }

  render() {
    const { Component, apollo, pageProps } = this.props

    // to expose the apollo client to the react app, we wrap the app in the client
    return (
      <Container>
        <ApolloProvider client={apollo}>
          <Page>
            <Component {...pageProps} />
          </Page>
        </ApolloProvider>
      </Container>
    )
  }
}

// export the app through the HOC that holds the data
export default withData(MyApp)
