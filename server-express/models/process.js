class Process {

    constructor(name, slug) {
        this.name = name;
        this.slug = slug;
    }

    print() {
        console.log({name: this.name, slug: this.slug});
    }
}

module.exports = Process;