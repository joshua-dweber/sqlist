import { useState, useEffect } from 'react';
import axios from 'axios';
import SQLCode from './SQLCode';
import useCollapse from 'react-collapsed';
import copy from 'copy-to-clipboard';

var getFromBetween = {
    results: [],
    string: "",
    getFromBetween: function (sub1, sub2) {
        if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var SP = this.string.indexOf(sub1) + sub1.length;
        var string1 = this.string.substr(0, SP);
        var string2 = this.string.substr(SP);
        var TP = string1.length + string2.indexOf(sub2);
        return this.string.substring(SP, TP);
    },
    removeFromBetween: function (sub1, sub2) {
        if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var removal = sub1 + this.getFromBetween(sub1, sub2) + sub2;
        this.string = this.string.replace(removal, "");
    },
    getAllResults: function (sub1, sub2) {
        // first check to see if we do have both substrings
        if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

        // find one result
        var result = this.getFromBetween(sub1, sub2);
        // push it to the results array
        this.results.push(result);
        // remove the most recently found one from the string
        this.removeFromBetween(sub1, sub2);

        // if there's more substrings
        if (this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
            this.getAllResults(sub1, sub2);
        }
        else return;
    },
    get: function (string, sub1, sub2) {
        this.results = [];
        this.string = string;
        this.getAllResults(sub1, sub2);
        return this.results;
    }
};

export default () => {
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse()

    const [sqlList, setSqlList] = useState([]);
    const [filter, setFilter] = useState("");
    const [filteredList, setFilteredList] = useState([]);
    const [addDesc, setAddDesc] = useState("");
    const [addContent, setAddContent] = useState("");

    useEffect(() => {
        axios.get('http://localhost:9000/sql', {})
            .then(res => {
                setSqlList(res.data);
                setFilteredList(res.data.map((val, i) => {
                    val["idx"] = i;
                    return val;
                }));
            });
    }, []);

    useEffect(() => {
        let newFilteredList = [];
        sqlList.forEach((sqlContent, i) => {
            if (sqlContent.sql.toLowerCase().includes(filter) || sqlContent.description.toLowerCase().includes(filter)) {
                sqlContent.idx = i;
                newFilteredList.push(sqlContent);
            }
        });
        setFilteredList(newFilteredList);
    }, [filter]);

    const copySql = index => {
        let content = sqlList[index].sql;
        let variables = [...new Set(getFromBetween.get(content, "{{", "}}"))]
        variables.forEach(variable => {
            content = content.replace(`{{${variable}}}`, document.getElementById(`${index}-${variable}`)?.value);
        });
        copy(content);
        //navigator.clipboard.writeText(content);
    }

    const addSql = () => {
        axios.post('http://localhost:9000/sql', { description: addDesc, sql: addContent })
            .then(res => {
                setSqlList(res.data);
                setFilteredList(res.data);
            }).catch(err => console.log(err));
    }

    return (<>
        <div id="main">
            <button {...getToggleProps()}>
                {isExpanded ? 'Collapse' : 'Show Add Tools'}
            </button>
            <div {...getCollapseProps()}>
                <span style={{ "fontSize": "20px" }}>Add SQL</span>
                <br />
                <label>Description: <input type="text" value={addDesc} onChange={e => setAddDesc(e.target.value)} /></label>
                <br />
                <textarea value={addContent} onChange={e => setAddContent(e.target.value)} />
                <br />
                <button onClick={addSql} className={"button"}>Add</button>
            </div>
            <br /><hr /><br />
            <input type="text" value={filter} onChange={e => setFilter(e.target.value)} />
            {
                filteredList.map(sqlContent => {
                    const checkVariables = () => {
                        let variables = [...new Set(getFromBetween.get(sqlContent.sql, "{{", "}}"))];
                        return (
                            <div className={"sqlInputBody"}>
                                {variables.map(variable => (<>
                                    <label>{variable}: </label>
                                    <input type="text" id={`${sqlContent.idx}-${variable}`} />
                                    <br />
                                </>))}
                            </div>
                        )
                    }

                    return (
                        <div className={"sqlBody"}>
                            <h3 className={"sqlDescription"}>{sqlContent.description}</h3>
                            <SQLCode code={sqlContent.sql} />
                            {checkVariables()}
                            <button className={"button"} onClick={() => copySql(sqlContent.idx)}>Copy</button>
                        </div>
                    )
                })
            }
        </div>
    </>);
}