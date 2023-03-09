const observable = Rx.Observable.fromEvent(document, 'click');

const clicks = observable
                .do( _ =>print('Do One Time !'))

let subject = clicks.multicast(() => new Rx.Subject() );

subject.connect();

let subA = subject.subscribe( c => print('Sub A : '+c.timeStamp))

subject.publish();

function print(val) {
    let el = document.querySelector('p');
    el.innerText = val;
}