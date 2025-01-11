import { Image } from 'react-native';
import { GetUserDto } from '../../../dto/user.dto';
import Dialog from '../../Dialog';

type Props = {
    dialog: string | undefined,
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>
    user?: GetUserDto
}

function CreateOrEditStaffDialog({ dialog, setDialog }: Props) {
    return (
        <Dialog fullScreen visible={dialog === 'CreateOrEditStaffDialog'} handleClose={() => setDialog(undefined)}
        >
            <Image style={{ flex: 1, height: '100%', width: '100%' }}
                source={{ uri: 'https://storage.googleapis.com/agarson-app-bucket/users%2Fmedia%2F1735974438421%2Fa915778e-da5d-496a-81f8-dd135407ec06.jpeg1735974430542' }} />
        </Dialog>
    )
}

export default CreateOrEditStaffDialog

