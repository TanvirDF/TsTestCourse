import { Reservation } from "../../app/server_app/model/ReservationModel";


expect.extend({
    toBeValidReservation(reservation: Reservation) { 
        const isValidId = reservation.id.length > 5;
        const isValidUser = reservation.user.length > 5;

        return {
            pass: isValidId && isValidUser,
            message: () => 
                `Expected reservation to be valid, but got id: ${reservation.id} and user: ${reservation.user}`
        }
    },
    toHaveUser(reservation: Reservation, user: string) {
        return {
            pass: reservation.user === user,
            message: () =>
                `Expected reservation to have user: ${user}, but got ${reservation.user}`
        }
    },
});

interface CustomMatchers<R>{
    toBeValidReservation(): R;
    toHaveUser(user: string): R;
}

declare global {
    namespace jest {
        interface Matchers<R> extends CustomMatchers<R> {}
    }
} // this is needed to extend the global expect object

const someReservation: Reservation = {  
    id: '123456',
    room: 'room',
    user: 'some user',
    startDate: '2021-01-01',
    endDate: '2021-01-02'
}


describe('Custom matchers test demo', () => { 
    it('check for valid reservation', () => { 
        expect(someReservation).toBeValidReservation();
        expect(someReservation).toHaveUser('some user')
    });
});
