import React from 'react'
// aria-compliant dropdown
import Downshift, { resetIdCounter } from 'downshift'
import Router from 'next/router'
//exposes apollo client for manual queries
import { ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'
import debounce from 'lodash.debounce'
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown'

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String) {
    items(where: {
      # provided by prisma on ItemWhereInput
      OR: [
        {title_contains: $searchTerm},
        {description_contains: $searchTerm}
      ]
    }) {
      id
      title
      image
    }
  }
`

function routeToItem(item) {
  Router.push({
    pathname: '/item',
    query: {
      id: item.id
    }
  })
}

// we won't do the usual Query wrapper because that fires on pageload. we only want to query when a user searches
//we need direct access to apollo client because then we can manually fire the queries instead of using a render prop
class Autocomplete extends React.Component {
  state = {
    items: [],
    loading: false
  }

  onChange = debounce(async (e, client) => {
    //turn loading on
    this.setState({ loading: true })
    //manually query apollo client
    const res = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: e.target.value }
    })

    this.setState({
      items: res.data.items,
      loading: false
    })
  }, 500)

  render() {
    resetIdCounter()
    return (
      <SearchStyles>
        <Downshift
          itemToString={item => item === null ? '' : item.title}
          onChange={routeToItem}>
          {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
            <div>
              <ApolloConsumer>
                {client => (
                  <input
                    type="search"
                    {...getInputProps({
                      type: 'search',
                      placeholder: 'Search for an item',
                      id: 'search',
                      className: this.state.loading ? 'loading' : '',
                      onChange: e => {
                        e.persist()
                        this.onChange(e, client)
                      }
                    })}
                  />
                )}
              </ApolloConsumer>
              {isOpen && (
                <DropDown>
                  {this.state.items.map((item, i) => (
                    <DropDownItem
                      key={item.id}
                      {...getItemProps({ item })}
                      highlighted={i === highlightedIndex}
                    >
                      <img
                        width="50"
                        src={item.image}
                        alt={item.title}
                      />
                      {item.title}
                    </DropDownItem>)
                  )}
                  {!this.state.items.length && !this.state.loading && (
                    <DropDownItem>Nothing found</DropDownItem>
                  )}
                </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </SearchStyles >
    )
  }
}

export default Autocomplete
