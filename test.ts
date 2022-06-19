let impl = {} as any;
globalThis.localStorage = {
    key: function (idx: number) {
        return Object.keys(impl)[idx];
    },
    length: Object.keys(impl).length,
    getItem: function (key: string) {
        return impl[key];
    },
    setItem: function (key, value) {
        impl[key] = value;
    },
    removeItem: function (key: string) {
        delete impl[key];
    },
    clear: function () {
        impl = {};
    },
};

// import  ".";
import orm from ".";
const { Entity, Field } = orm;
@Entity("UTUser", "id")
class User {
    id: string;
    name: string;
    constructor(json?: any) {
        if (json != null) {
            this.id = json["id"];
            this.name = json["jack"];
        }
    }
}
@Entity("Student", "id")
export class Student {
    id: string;
    stdid: string;
    @Field(User)
    user: User;
    constructor(json?: any) {
        if (json != null) {
            this.id = json["id"];
            this.stdid = json["stdid"];
        }
    }
}

const user = new User({ id: 1 });
user.name = "Tom";
const student = new Student({ id: "1" });
student.stdid = "1";
student.user = user;
console.log(student);
orm.save(student);
console.log(orm.find(Student, "1"));
