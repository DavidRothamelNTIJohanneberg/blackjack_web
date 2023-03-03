const prompt = require("prompt-sync")();

class kort {
    constructor(value, color, real) {
        this.value = value;
        this.color = color;
        this.realValue = real;
    }

    switch_value() {
        if (this.value == 1) {
            this.realValue = (this.realValue === 1) ? 11 : 1;
        }
    }
}

class main {
    constructor(players, shuffles, amount) {
        this.board = this.board_creater();
        this.actors = this.player_creater(players); // Amount of players
        this.myDeck = new kortlek(amount); //creates kortlek
        this.myDeck.shuffle(shuffles);
    }

    board_creater() {
        const ai_part = document.createElement("div");
        const player_part = document.createElement("div");

        ai_part.id = "ai_part";
        player_part.id = "player_part";
        document.body.appendChild(ai_part);
        document.body.appendChild(player_part);
    }

    all_done(actors) {
        let output = true;
        for (let i of actors) {
            console.log("dont want card: ")
            console.log(i.dont_want_card)
            if (i.dont_want_card == false) {
                output = false;
            }
        }
        return(output);
    }

    check_winner(actors) {
        let winner_sum = 0;
        let winner;

        for (let i of actors) {
            if (i.sum() > winner_sum && i.sum() < 22) {
                winner_sum = i.sum();
                winner = i.name;
            }
        }

        return(winner);
    }

    player_creater(amount) {
        const actor_array = [];
        for (let i = 0; i < amount; i++) {
            actor_array.push(new player("player " + (i + 1)))
        }
        actor_array.push(new ai("AI"));
        return(actor_array);
    }

    print_hands(actors) {
        for (let i of actors) {
            console.log(i.hand);
            console.log(i.sum());
        }
    }

    start() {
        this.actors[-1].create_div(ai_part);
        for (let h = 0; i < (this.actors.length() - 1); h++) {
            h.create_div(player_part);
        }
        for (let i = 0; i < 2; i++) {
            for (let j of this.actors) {
                j.take_card(this.myDeck);
            }
        }
    }

    game() {
        let eternal = true;
        while(eternal) {
            this.print_hands(this.actors);
            for (let i of this.actors) {
                i.want_card(this.myDeck);
            }
            if (this.all_done(this.actors)) {
                eternal = false;
            }
        }
    }

    end() {
        console.log(this.check_winner(this.actors));
    }

    game_loop() {
        this.start();
        this.game();
        this.end();
    }
}

class kortlek {
    constructor(amount) {
        this.deck = [];
        this.deck_creater(amount);
    }

    deck_creater(amount = 1) {
        const colors = ["Hearts", "Diamonds", "Spades", "Clubs"];
        for (let y = 0; y < amount; y++) {
            for (let i = 0; i < 4; i++) {
                for (let x = 1; x < 14; x++) {
                    if (x > 10) {
                        this.deck.push(new kort(x, colors[i], 10));
                        continue;
                    } 
                    this.deck.push(new kort(x, colors[i], x));
                }
            }
        }
    }

    shuffle(amount = 1) {
        for (let k = 0; k < amount; k++) {
            for (let i = this.deck.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
            }
        }
        return("funkar");
    }

    deal_card() {
        this.deck[0].switch_value();
        return(this.deck.shift());
    }
}

class player {
    constructor(name, parent) {
        this.name = name;
        this.hand = [];
        this.points = 0;
        this.dont_want_card = false;
        this.create_div(parent);
    }

    take_card(deck) {
        this.hand.push(deck.deal_card());
        this.check_ace_value();
        if (this.sum() > 21) {
            this.dont_want_card = true;
        }
    }

    want_card(deck) {
        if (this.dont_want_card == false) {
            if (prompt("kort y/n? ") == "y") {
                this.take_card(deck);
            } else {
                this.dont_want_card = true;
            }
        }
    }

    check_ace_value() {
        if (this.sum() > 21) {
            for (let x of this.hand) {
                if (x.realValue == 11) {
                    x.switch_value();
                }
            }
        }
     }

    sum() {
        let summa = 0;
        for (let i of this.hand) {
            summa += i.realValue;
        }
        return(summa);
    }
}

class ai extends player {
    constructor(name) {
        super(name);
    }

    want_card(deck) { //FIXA
        if ((this.sum() < 17 && this.dont_want_card == false) || (this.hand.length < 2)) {
            this.take_card(deck);
        } else {
            this.dont_want_card = true;
        }

        //Perhaps add something here that makes the game go game over if ai is over 21
    }


}

const game = new main(1, 1, 1);

game.game_loop();

