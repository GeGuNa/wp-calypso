import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { requestLocaleSuggestions } from 'calypso/state/i18n/locale-suggestions/actions';
import getLocaleSuggestions from 'calypso/state/selectors/get-locale-suggestions';

class QueryLocaleSuggestions extends Component {
	static propTypes = {
		localeSuggestions: PropTypes.array,
		requestLocaleSuggestions: PropTypes.func,
	};

	static defaultProps = {
		requestLocaleSuggestions: () => {},
	};

	componentDidMount() {
		if ( ! this.props.localeSuggestions ) {
			this.props.requestLocaleSuggestions();
		}
	}

	render() {
		return null;
	}
}

export default connect(
	( state ) => ( {
		localeSuggestions: getLocaleSuggestions( state ),
	} ),
	{ requestLocaleSuggestions }
)( QueryLocaleSuggestions );
