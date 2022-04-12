import {utils} from "../scriptUtils.js"

export class sdwTextContent extends HTMLElement {
    
    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.refs = {}

        this.expanded = false
    }

    static get observedAttributes() { return []; }

    attributeChangedCallback(name, oldValue, newValue) { }

    connectedCallback () {

        this.elmStyle = document.createElement("style")
        this.shadow.appendChild(this.elmStyle)

        this.elmRoot = document.createElement("div")
        this.elmRoot.className = "root"
        this.shadow.appendChild(this.elmRoot)

        this.elmStyle.textContent = files[this.constructor.name].css
        this.elmRoot.innerHTML = files[this.constructor.name].html

        this.refs = utils.getRefs(this.elmRoot)
        this.load()
    }

    async load () {

        utils.initTooltips(this.elmRoot)

        this.refs["easy-title"].addEventListener("click", () => {
            this.addText("title")
        })

        this.refs["easy-small"].addEventListener("click", () => {
            this.addText("small")
        })

        this.refs["easy-large"].addEventListener("click", () => {
            this.addText("large")
        })

        this.refs["text-content"].addEventListener("input", () => {
            this.textContentUpdate()
        })

        this.refs["text-content"].addEventListener("change", () => {
            this.textContentUpdate()
        })
    }

    setVisualization () {
        this.refs["text-content"].value = app.refSelected.getText()
    }

    addText (type) {
        let value = ""
        let texts = []
        switch (type) {
            case "title":
                texts = [
                    'To the infinity and beyond',
                    'I have a dream that one day every valley shall be engulfed',
                    'This is our hope',
                    'Be the change that you wish to see in the world',
                    'Live as if you were to die tomorrow',
                    'An eye for an eye will only make the whole world blind',
                    'Nobody can hurt me without my permission',
                    'Your values become your destiny',
                    'A man is but the product of his thoughts',
                    'What makes it great',
                    'The magic inside',
                    'Innovation at its best',
                    'Where the oportunities find solutions',
                    'Change the world from home',
                    'Small improvements that makes it great',
                    'Where innovation meets humans',
                    'Enjoy teamworking',
                    'There are no boundaries',
                    'Boundaries are just conventions',
                    'Success stories from real world',
                    'Time to grow with your business',
                ]
                break;
            case "small":
                texts = [
                    "The exploration of space will go ahead, whether we join in it or not, and it is one of the great adventures of all time, and no nation which expects to be the leader of other nations can expect to stay behind in the race for space.",
                    "You can’t connect the dots looking forward; you can only connect them looking backward. So you have to trust that the dots will somehow connect in your future. You have to trust in something — your gut, destiny, life, karma, whatever.",
                    "Your time is limited, so don’t waste it living someone else’s life. Don’t be trapped by dogma — which is living with the results of other people’s thinking. Don’t let the noise of others’ opinions drown out your own inner voice.",
                    "Hope is not blind optimism. It's not ignoring the enormity of the task ahead or the roadblocks that stand in our path. It's not sitting on the sidelines or shirking from a fight. Hope is that thing inside us that insists, despite all evidence to the contrary, that something better awaits us if we have the courage to reach for it, and to work for it, and to fight for it.",
                    "You know, when you get old, in life, things get taken from you. I mean, that’s… that’s… that’s a part of life. But, you only learn that when you start losing stuff.",
                    "The one thing that has shaped our world to the one we know today is happiness. I believe that happiness is available to anyone at any moment at any place. I believe that we're not the only ones experiencing it. Everybody experiences it differently, but in the end, it is the same.",
                ]
                break;
            case "large":
                texts = [
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
                ]
                break;
        }
        value = texts[Math.floor(Math.random()*texts.length)];
        this.refs["text-content"].value = value
        this.textContentUpdate()
    }

    textContentUpdate () {
        let value = this.refs["text-content"].value

        app.refSelected.setText(value)

        app.refs["preview"].refs["content"].contentWindow.select(app.refSelected.refPreview)
    }
}