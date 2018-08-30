import React from 'react';
import {
    Input,
    Button
} from 'semantic-ui-react';
import unleashedButton from '../unleashed_logo.png';
import {
    getRefresh,
    updateAuthLink,
    updateAuth
} from '../../../modules/refresh'

import { connect } from 'react-redux';

const mapStateToProps = state => ({
    refresh: state.gSheets.refresh
})

const mapDispatchToProps = dispatch => (
    {
        updateAuthLink: (authCode) => dispatch(updateAuthLink(authCode)),
        updateAuth: (newCode) => dispatch(updateAuth(newCode))
    }
)

const NewAuth = props => {
console.log(props.refresh.newCode)
    switch (props.incl) {
        case (true):
            return (
                <div>
                    <a href={props.refresh.url} target="_blank">
                        Update Integration
                </a>
                    <Input
                        value={props.refresh.newCode}
                        onChange={(e, { value }) => props.updateAuthLink(value)}
                    />
                    {props.refresh.newCode != '' && props.refresh.newCode != undefined ?
                        <Button
                            primary
                            onClick={() => props.updateAuth(props.refresh)}
                        >
                                Refresh
                    </Button> : <div />}
    
 
 
            </div>



                    )
                    default:
                        return ''
                }
            
            }
            
            
            export default connect(
                mapStateToProps,
                mapDispatchToProps
            )(NewAuth)
