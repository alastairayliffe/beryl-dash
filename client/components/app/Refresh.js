import React from 'react';
import {
    Container,
    Segment,
    Header,
    Form,
    Transition,
    Image,
    Icon,
    List,
    Button,
    Input
} from 'semantic-ui-react';
import unleashedButton from './unleashed_logo.png';
import {
    getRefresh,
} from '../../modules/refresh'
import NewAuth from './refresh/NewAuth'

import { connect } from 'react-redux';

const mapStateToProps = state => ({
    refresh: state.gSheets.refresh
})

const mapDispatchToProps = dispatch => (
    {
        getRefresh: () => dispatch(getRefresh()),
    }
)

class Refresh extends React.Component {

    render() {
        console.log(this.props)

        return (
            <div>
                <Container>
                    <Segment stacked>
                        <Header as='h4' color='blue'>
                            Integrations
                      </Header>
                        <List >
                            <Form.Group inline>
                                <Form.Field>

                                    <Image
                                        src={unleashedButton}
                                        size='small'
                                        onClick={this.props.getRefresh}
                                    />

                                </Form.Field>
                                <NewAuth
                                    incl={this.props.refresh.inclUrl}
                                />
                                </Form.Group>

                        </List>
                    </Segment>
                </Container>
            </div>
                    )
                }
            }
            
            export default connect(
                mapStateToProps,
                mapDispatchToProps
            )(Refresh)
