var app = new Vue({
    el: "#assignment",
    data() {
        return {
            myName: 'Juan Pablo Sánchez',
            age: 21,
            urlImage: 'https://cdn.vox-cdn.com/thumbor/zEZJzZFEXm23z-Iw9ESls2jYFYA=/89x0:1511x800/1600x900/cdn.vox-cdn.com/uploads/chorus_image/image/55717463/google_ai_photography_street_view_2.0.jpg'
        };
    },
    methods: {
        addAge() {
            return this.age + 5;
        },
        randomNumber() {
            return Math.random();
        }
    }
});